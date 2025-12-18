const serviceMen = [
            { name: "John Doe", phone: "9876543210", area: "Chennai" },
            { name: "Priya Kumar", phone: "9123456780", area: "Bangalore" },
            { name: "Amit Singh", phone: "9988776655", area: "Mumbai" }
        ];
        const serviceCenters = [
            { name: "TechFix Service Center", address: "123 Anna Salai, Chennai", area: "Chennai" },
            { name: "LaptopCare Center", address: "45 MG Road, Bangalore", area: "Bangalore" },
            { name: "MobilePro Service", address: "78 Andheri East, Mumbai", area: "Mumbai" }
        ];
        document.querySelectorAll('.service-box').forEach(box => {
            box.addEventListener('click', function() {
                document.getElementById('serviceBoxes').classList.add('hidden');
                document.getElementById('issueForm').classList.remove('hidden');
                document.getElementById('formTitle').textContent = this.getAttribute('data-device') + " Service Request";
                document.getElementById('category').value = "";
                document.getElementById('problem').value = "";
                document.getElementById('address').value = "";
                document.getElementById('picture').value = "";
                document.getElementById('video').value = "";
                document.getElementById('result').style.display = 'none';
                document.getElementById('map').style.display = 'none';
                document.getElementById('backBtn').style.display = 'inline-block';
            });
        });
        document.getElementById('issueForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const category = document.getElementById('category').value;
            const problem = document.getElementById('problem').value;
            const address = document.getElementById('address').value;
            let found = serviceMen.find(s => address.toLowerCase().includes(s.area.toLowerCase()));
            const resultDiv = document.getElementById('result');
            const mapDiv = document.getElementById('map');
            resultDiv.style.display = 'block';
            if (found) {
                resultDiv.innerHTML = `
                    <strong>Service Man Details:</strong><br>
                    Name: ${found.name}<br>
                    Phone: <a href="tel:${found.phone}">${found.phone}</a><br>
                    Area: ${found.area}
                `;
                let center = serviceCenters.find(c => address.toLowerCase().includes(c.area.toLowerCase()));
                if (center) {
                    showMap(center.address, center.name);
                } else {
                    mapDiv.style.display = 'none';
                }
            } else {
                resultDiv.innerHTML = `
                    <strong>No direct service man found for your area.</strong><br>
                    Showing nearby service centers on map below.
                `;
                showMap(address + ' service center');
            }
        });
        function showMap(location, label = "") {
            const mapDiv = document.getElementById('map');
            mapDiv.style.display = 'block';
            const query = encodeURIComponent(location);
            mapDiv.innerHTML = `<iframe
                width="100%"
                height="250"
                frameborder="0"
                style="border:0"
                src="https://www.google.com/maps?q=${query}&output=embed"
                allowfullscreen
                title="Service Center Map">
            </iframe>
            ${label ? `<div style="margin-top:8px;text-align:center;"><strong>${label}</strong><br>${location}</div>` : ""}`;
        }
        function goBackToDeviceSelect() {
            document.getElementById('serviceBoxes').classList.remove('hidden');
            document.getElementById('issueForm').classList.add('hidden');
            document.getElementById('result').style.display = 'none';
            document.getElementById('map').style.display = 'none';
            document.getElementById('backBtn').style.display = 'none';
        }